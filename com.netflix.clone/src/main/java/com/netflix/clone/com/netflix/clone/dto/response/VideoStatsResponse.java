package com.netflix.clone.com.netflix.clone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoStatsResponse {

    private Long totalVideos;
    private Long publishedVideos;
    private Long totalDuration;
}
