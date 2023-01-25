package com.lookatme.server.member.mapper;

import com.lookatme.server.member.dto.MemberDto.Post;
import com.lookatme.server.member.dto.MemberDto.Response;
import com.lookatme.server.member.dto.MemberDto.ResponseWithFollow;
import com.lookatme.server.member.entity.Member;
import com.lookatme.server.member.entity.Member.MemberBuilder;
import com.lookatme.server.member.entity.OauthPlatform;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-01-25T15:33:01+0900",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.16.1 (Eclipse Adoptium)"
)
@Component
public class MemberMapperImpl implements MemberMapper {

    @Override
    public Member memberPostDtoToMember(Post memberPostDto) {
        if ( memberPostDto == null ) {
            return null;
        }

        MemberBuilder member = Member.builder();

        member.account( memberPostDto.getAccount() );
        member.password( memberPostDto.getPassword() );
        member.nickname( memberPostDto.getNickname() );
        member.height( memberPostDto.getHeight() );
        member.weight( memberPostDto.getWeight() );
        member.profileImageUrl( memberPostDto.getProfileImageUrl() );

        return member.build();
    }

    @Override
    public Response memberToMemberResponse(Member member) {
        if ( member == null ) {
            return null;
        }

        long memberId = 0L;
        String email = null;
        OauthPlatform oauthPlatform = null;
        String nickname = null;
        String profileImageUrl = null;
        int height = 0;
        int weight = 0;
        int followerCnt = 0;
        int followeeCnt = 0;

        memberId = member.getMemberId();
        email = member.getEmail();
        oauthPlatform = member.getOauthPlatform();
        nickname = member.getNickname();
        profileImageUrl = member.getProfileImageUrl();
        height = member.getHeight();
        weight = member.getWeight();
        followerCnt = member.getFollowerCnt();
        followeeCnt = member.getFolloweeCnt();

        Response response = new Response( memberId, email, oauthPlatform, nickname, profileImageUrl, height, weight, followerCnt, followeeCnt );

        return response;
    }

    @Override
    public ResponseWithFollow memberToMemberResponseWithFollow(Member member) {
        if ( member == null ) {
            return null;
        }

        long memberId = 0L;
        String email = null;
        OauthPlatform oauthPlatform = null;
        String nickname = null;
        String profileImageUrl = null;
        int height = 0;
        int weight = 0;
        int followerCnt = 0;
        int followeeCnt = 0;
        boolean follow = false;

        memberId = member.getMemberId();
        email = member.getEmail();
        oauthPlatform = member.getOauthPlatform();
        nickname = member.getNickname();
        profileImageUrl = member.getProfileImageUrl();
        height = member.getHeight();
        weight = member.getWeight();
        followerCnt = member.getFollowerCnt();
        followeeCnt = member.getFolloweeCnt();
        follow = member.isFollow();

        ResponseWithFollow responseWithFollow = new ResponseWithFollow( memberId, email, oauthPlatform, nickname, profileImageUrl, height, weight, followerCnt, followeeCnt, follow );

        return responseWithFollow;
    }

    @Override
    public List<Response> memberListToMemberResponseList(List<Member> memberList) {
        if ( memberList == null ) {
            return null;
        }

        List<Response> list = new ArrayList<Response>( memberList.size() );
        for ( Member member : memberList ) {
            list.add( memberToMemberResponse( member ) );
        }

        return list;
    }
}
