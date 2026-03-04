package com.netflix.clone.com.netflix.clone.service;

import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.http.ResponseEntity;

import com.netflix.clone.com.netflix.clone.dto.request.videoRequest;
import com.netflix.clone.com.netflix.clone.dto.response.MessageResponse;
import com.netflix.clone.com.netflix.clone.dto.response.PageResponse;
import com.netflix.clone.com.netflix.clone.dto.response.VideoResponse;
import com.netflix.clone.com.netflix.clone.dto.response.VideoStatsResponse;

import jakarta.validation.Valid;

public interface VideoService {

    MessageResponse createVideoByAdmin(videoRequest videoRequest);

    PageResponse getAllAdminVideo(int page, int size, String search);

    MessageResponse updateVideoByAdmin(Long id, videoRequest videoRequest);

    MessageResponse deleteVideoByAdmin(Long id);

    MessageResponse toggleVideoPublishStatusByAdmin(Long id, boolean value);

    VideoStatsResponse getAdminStats();

    PageResponse<VideoResponse> getPublishedVideos(int page, int size, String search, String email);

    List<VideoResponse> getFeaturedVideos();


}
