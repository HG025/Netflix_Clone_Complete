package com.netflix.clone.com.netflix.clone.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    private List<T> content;
    private Long totalElement;
    private int TotalPages;
    private int number;
    private int size;

}
