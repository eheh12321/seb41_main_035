package com.lookatme.server.board.dto;

import com.lookatme.server.product.dto.ProductPostDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BoardPostDto {
    private String content;
    private List<ProductPostDto> products;
}