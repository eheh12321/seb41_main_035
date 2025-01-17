package com.lookatme.server.auth.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lookatme.server.auth.dto.LoginRequest;
import com.lookatme.server.auth.jwt.JwtTokenizer;
import com.lookatme.server.auth.jwt.RedisRepository;
import com.lookatme.server.auth.userdetails.MemberDetails;
import com.lookatme.server.member.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final RedisRepository redisRepository;
    private final JwtTokenizer jwtTokenizer;

    @SneakyThrows
    @Override // LoginDto를 받아서 로그인 인증 -> MemberDetailsService의 loadUserByUsername을 이용
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        ObjectMapper objectMapper = new ObjectMapper();
        LoginRequest loginRequest = objectMapper.readValue(request.getInputStream(), LoginRequest.class);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), loginRequest.getPassword());
        request.setAttribute("email", loginRequest.getEmail());

        return authenticationManager.authenticate(authenticationToken);
    }

    @Override // 로그인 인증에 성공했을 경우 JWT 토큰 만들어서 Success 핸들러로 전달
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult) throws ServletException, IOException {
        MemberDetails memberDetails = (MemberDetails) authResult.getPrincipal();
        Member member = memberDetails.getMember();

        String accessToken = delegateAccessToken(member);
        String refreshToken = delegateRefreshToken(member);

        // Access Token은 Authorization 헤더를 통한 전달
        response.setHeader("Authorization", accessToken);

        // Refresh Token은 HttpOnly Cookie를 통한 전달
        Cookie cookie = new Cookie("Refresh", refreshToken);
        cookie.setMaxAge(jwtTokenizer.getRefreshTokenExpirationMinutes() * 60);
        cookie.setDomain("myprojectsite.shop");
        cookie.setSecure(true); // HTTPS 환경에서만 이용 가능
        cookie.setHttpOnly(true); // 클라이언트 측에서 XSS(악성 스크립트 공격)로 탈취 방지
        cookie.setPath("/auth/reissue"); // 토큰 재발급 시에만 전송
        response.addCookie(cookie);

        // Redis 저장소에 RefreshToken을 저장
        redisRepository.saveRefreshToken(refreshToken, member.getUniqueKey());

        this.getSuccessHandler().onAuthenticationSuccess(request, response, authResult);
    }

    // Access token 생성 ** 꼭 필요한 정보만 담는 것이 좋음 **
    private String delegateAccessToken(Member member) {
        String accessToken = jwtTokenizer.delegateAccessToken(member);
        return accessToken;
    }

    private String delegateRefreshToken(Member member) {
        String subject = member.getUniqueKey();
        Date expiration = jwtTokenizer.getTokenExpiration(jwtTokenizer.getRefreshTokenExpirationMinutes());
        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());
        String refreshToken = jwtTokenizer.generateRefreshToken(subject, expiration, base64EncodedSecretKey);

        return refreshToken;
    }
}
