package com.netflix.clone.com.netflix.clone.serviceImpl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.netflix.clone.com.netflix.clone.dao.UserRepository;
import com.netflix.clone.com.netflix.clone.dao.VideoRepository;
import com.netflix.clone.com.netflix.clone.dto.request.videoRequest;
import com.netflix.clone.com.netflix.clone.dto.response.MessageResponse;
import com.netflix.clone.com.netflix.clone.dto.response.PageResponse;
import com.netflix.clone.com.netflix.clone.dto.response.VideoResponse;
import com.netflix.clone.com.netflix.clone.dto.response.VideoStatsResponse;
import com.netflix.clone.com.netflix.clone.entity.Video;
import com.netflix.clone.com.netflix.clone.service.VideoService;
import com.netflix.clone.com.netflix.clone.util.PaginationUtil;
import com.netflix.clone.com.netflix.clone.util.ServiceUtil;

@Service
public class VideoServiceImpl implements VideoService{

    @Autowired
    private VideoRepository videoRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceUtil serviceUtil;

    @Override
    public MessageResponse createVideoByAdmin(videoRequest videoRequest) {
        Video video = new Video();
        video.setTitle(videoRequest.getTitle());
        video.setDescription(videoRequest.getDescription());
        video.setYear(videoRequest.getYear());
        video.setRating(videoRequest.getRating());
        video.setDuration(videoRequest.getDuration());
        video.setSrcUuid(videoRequest.getSrc());
        video.setPosterUuid(videoRequest.getPoster());
        video.setPublished(videoRequest.isPublished());
        video.setCategories(videoRequest.getCategories()!=null ? videoRequest.getCategories() : List.of());
        videoRepository.save(video);
        return new MessageResponse("Video created successfully!");

    }

    @Override
    public PageResponse getAllAdminVideo(int page, int size, String search) {
        Pageable pageable = PaginationUtil.createPageRequest(page, size, "id");
        Page<Video> videoPage;

        if(search != null && !search.trim().isEmpty()) {
            videoPage = videoRepository.SearchVideos(search.trim(), pageable);
        } else {
            videoPage = videoRepository.findAll(pageable);
        }
        return PaginationUtil.toPageResponse(videoPage, VideoResponse::fromEntity);
    }

    @Override
    public MessageResponse updateVideoByAdmin(Long id, videoRequest videoRequest) {
        Video video = new Video();
        video.setId(id);
        video.setTitle(videoRequest.getTitle());
        video.setDescription(videoRequest.getDescription());
        video.setYear(videoRequest.getYear());
        video.setRating(videoRequest.getRating());
        video.setDuration(videoRequest.getDuration());
        video.setSrcUuid(videoRequest.getSrc());
        video.setPosterUuid(videoRequest.getPoster());
        video.setPublished(videoRequest.isPublished());
        video.setCategories(videoRequest.getCategories()!=null ? videoRequest.getCategories() : List.of());
        videoRepository.save(video);
        return new MessageResponse("Video updated successfully!");

        
    }

    @Override
    public MessageResponse deleteVideoByAdmin(Long id) {
        if(!videoRepository.existsById(id)){
            throw new IllegalArgumentException("Video not found:" +id);
        }
        videoRepository.deleteById(id);
        return new MessageResponse("Video deleted successfully!");
    }

    @Override
    public MessageResponse toggleVideoPublishStatusByAdmin(Long id, boolean status) {
        Video video = serviceUtil.getVideoByIdOrThrow(id);
        video.setPublished(status);
        videoRepository.save(video);
        return new MessageResponse("Video published status updated successfully!");
    }

    @Override
    public VideoStatsResponse getAdminStats() {
        long totalVideo = videoRepository.count();
        long publishedVideos = videoRepository.countPublishedVideos();
        long totalDuration = videoRepository.getTotalDuration();

        return new VideoStatsResponse(totalVideo, publishedVideos, totalDuration);
    }

    @Override
    public PageResponse<VideoResponse> getPublishedVideos(int page, int size, String search, String email) {
     Pageable pageable = PaginationUtil.createPageRequest(page, size, "id");
     Page<Video> videoPage;

     if(search != null && !search.trim().isEmpty()){
        videoPage = videoRepository.SearchPublichedVideos(search.trim(), pageable);
     }
     else {
        videoPage = videoRepository.findPublishedVideos(pageable);
     }
     List<Video> videos = videoPage.getContent();
    //  setting watchlist id as empty
     Set<Long> watchlistIds = Set.of();
     if(!videos.isEmpty()){
        try {
            List<Long> videoIds = videos.stream().map(Video::getId).toList();
            watchlistIds = userRepository.findWatchListVideoIds(email, videoIds);

        } catch (Exception e) {
            watchlistIds = Set.of();
        }
     }
     Set<Long> finalWatchlistIds = watchlistIds;
     videos.forEach(video -> video.setIsInWatchList(finalWatchlistIds.contains(video.getId())));
     List<VideoResponse> videoResponses = videos.stream().map(VideoResponse::fromEntity).toList();
     return PaginationUtil.toPageResponse(videoPage, videoResponses);

    }

    @Override
    public List<VideoResponse> getFeaturedVideos() {
    Pageable pageable = PageRequest.of(0, 5);
    List<Video> videos = videoRepository.findRandomPublishedVideos(pageable);
    return videos.stream().map(VideoResponse:: fromEntity).toList();
    }

}
