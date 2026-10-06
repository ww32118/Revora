package com.Revora.Revora_Main.controller;

import com.Revora.Revora_Main.dto.ReviewRequest;
import com.Revora.Revora_Main.dto.ReviewResponse;
import com.Revora.Revora_Main.dto.UpdateReviewRequest;
import com.Revora.Revora_Main.service.ReviewService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/addreview")
    public ReviewResponse addReview(@RequestBody ReviewRequest reviewRequest) {

        return reviewService.addReview(reviewRequest);
    }

    @PutMapping("/{id}/updatereview")
    public ReviewResponse updateReview(@PathVariable Long id,@RequestBody UpdateReviewRequest updateReviewRequest) {

        return reviewService.updateReview(id,updateReviewRequest);
    }

    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
    }

    @GetMapping("/users/{id}")
    public List<ReviewResponse> getReviewedByUser(@PathVariable Long id) {

        return reviewService.getReviewedByUser(id);
    }

    @PutMapping("/{id}/update-feedback")
    public ReviewResponse updateFeedbackText(@PathVariable Long id,@RequestParam String feedback) {

        return reviewService.updateFeedbackText(id, feedback);
    }
}
