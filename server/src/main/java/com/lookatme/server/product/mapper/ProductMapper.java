package com.lookatme.server.product.mapper;

import com.lookatme.server.product.dto.ProductPostDto;
import com.lookatme.server.product.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "rentals", ignore = true)
    Product productPostToProduct(ProductPostDto post);

//    Product productPatchToProduct(ProductPatchDto patch);
//    ProductResponseDto productToProductResponseDto(Product product);
//    List<ProductResponseDto> ProductsToProductResponseDtos(List<Product> product);
}