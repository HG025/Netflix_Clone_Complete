package com.netflix.clone.com.netflix.clone.service;

import org.jspecify.annotations.Nullable;

import com.netflix.clone.com.netflix.clone.dto.response.MessageResponse;
import com.netflix.clone.com.netflix.clone.dto.response.PageResponse;
import com.netflix.clone.com.netflix.clone.dto.response.VideoResponse;

public interface WatchlistService {

    MessageResponse addToWatchList(String email, Long videoId);

    MessageResponse removeFromWatchList(String email, Long videoId);

    PageResponse<VideoResponse> getWatchlist(String email, int page, int size, String search);

}
