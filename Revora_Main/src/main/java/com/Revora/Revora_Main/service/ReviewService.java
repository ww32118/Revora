package com.Revora.Revora_Main.service;

import com.Revora.Revora_Main.dto.ReviewRequest;
import com.Revora.Revora_Main.dto.ReviewResponse;
import com.Revora.Revora_Main.dto.UpdateReviewRequest;
import com.Revora.Revora_Main.exception.CodeSubmissionNotFoundException;
import com.Revora.Revora_Main.exception.ReviewNotFoundException;
import com.Revora.Revora_Main.exception.UserNotFoundException;
import com.Revora.Revora_Main.model.CodeSubmission;
import com.Revora.Revora_Main.model.Review;
import com.Revora.Revora_Main.model.User;
import com.Revora.Revora_Main.repository.CodeSubmissionRepository;
import com.Revora.Revora_Main.repository.ReviewRepository;
import com.Revora.Revora_Main.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CodeSubmissionRepository codeSubmissionRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, CodeSubmissionRepository codeSubmissionRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.codeSubmissionRepository = codeSubmissionRepository;
    }

    public ReviewResponse addReview(ReviewRequest request) {

        User user =  userRepository.findById(request.getUserId()).orElseThrow(() -> new UserNotFoundException("User not Found by id: " + request.getUserId()));
        CodeSubmission codeSubmission = codeSubmissionRepository.findById(request.getSubmissionId()).orElseThrow(() -> new CodeSubmissionNotFoundException("Code Submission Not Found By Id : " + request.getSubmissionId()));
        Review review = new Review();

        review.setCodeSubmission(codeSubmission);
        review.setDate(LocalDateTime.now());
        review.setDecision(request.getDecision());
        review.setReviewedBy(user);
        review.setFeedbackText(request.getFeedbackText());
        reviewRepository.save(review);

        ReviewResponse reviewResponse = new ReviewResponse();

        reviewResponse.setId(review.getId());
        reviewResponse.setReviewedByUsername(user.getUsername());
        reviewResponse.setDecision(review.getDecision());
        reviewResponse.setFeedbackText(review.getFeedbackText());
        reviewResponse.setDate(review.getDate());
        reviewResponse.setSubmissionId(codeSubmission.getId());


        return reviewResponse;

    }

    public ReviewResponse updateReview(Long id,UpdateReviewRequest updateReviewRequest) {

        Review review = reviewRepository.findById(id).orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));
        review.setFeedbackText(updateReviewRequest.getFeedbackText());
        review.setDate(LocalDateTime.now());
        review.setDecision(updateReviewRequest.getDecision());
        reviewRepository.save(review);

        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setId(review.getId());
        reviewResponse.setReviewedByUsername(review.getReviewedBy().getUsername());
        reviewResponse.setFeedbackText(review.getFeedbackText());
        reviewResponse.setDate(review.getDate());
        reviewResponse.setDecision(review.getDecision());
        reviewResponse.setSubmissionId(review.getCodeSubmission().getId());

        return reviewResponse;
    }

    public void deleteReview(Long id) {

        reviewRepository.deleteById(id);

    }

    public List<ReviewResponse> getReviewedByUser(Long id) {

        List<Review> reviews = reviewRepository.findByReviewedById(id);
        List<ReviewResponse> reviewResponseList = new ArrayList<>();

        for(Review review : reviews){

            ReviewResponse reviewResponse = new ReviewResponse();
            reviewResponse.setId(review.getId());
            reviewResponse.setReviewedByUsername(review.getReviewedBy().getUsername());
            reviewResponse.setFeedbackText(review.getFeedbackText());
            reviewResponse.setDate(review.getDate());
            reviewResponse.setSubmissionId(review.getCodeSubmission().getId());
            reviewResponse.setDecision(review.getDecision());
            reviewResponseList.add(reviewResponse);

        }

        return reviewResponseList;

    }

    public ReviewResponse updateFeedbackText(Long id,String feedback) {

        Review review = reviewRepository.findById(id).orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));
        review.setFeedbackText(feedback);
        reviewRepository.save(review);

        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setId(review.getId());
        reviewResponse.setReviewedByUsername(review.getReviewedBy().getUsername());
        reviewResponse.setFeedbackText(review.getFeedbackText());
        reviewResponse.setDate(review.getDate());
        reviewResponse.setSubmissionId(review.getCodeSubmission().getId());
        reviewResponse.setDecision(review.getDecision());


        return reviewResponse;
    }
}
