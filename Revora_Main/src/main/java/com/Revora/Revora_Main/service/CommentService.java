package com.Revora.Revora_Main.service;

import com.Revora.Revora_Main.dto.CommentRequest;
import com.Revora.Revora_Main.dto.CommentResponse;
import com.Revora.Revora_Main.exception.CodeSubmissionNotFoundException;
import com.Revora.Revora_Main.exception.CommentNotFoundException;
import com.Revora.Revora_Main.exception.UserNotFoundException;
import com.Revora.Revora_Main.model.CodeSubmission;
import com.Revora.Revora_Main.model.Comment;
import com.Revora.Revora_Main.model.User;
import com.Revora.Revora_Main.repository.CodeSubmissionRepository;
import com.Revora.Revora_Main.repository.CommentRepository;
import com.Revora.Revora_Main.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final CodeSubmissionRepository codeSubmissionRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, CodeSubmissionRepository codeSubmissionRepository, UserRepository userRepository) {

        this.commentRepository = commentRepository;
        this.codeSubmissionRepository = codeSubmissionRepository;
        this.userRepository = userRepository;

    }

    public CommentResponse addComment(CommentRequest commentRequest) {

        User user = userRepository.findById(commentRequest.getUserId()).orElseThrow(() -> new UserNotFoundException(" User not found with : " + commentRequest.getUserId()));
        CodeSubmission codeSubmission = codeSubmissionRepository.findById(commentRequest.getSubmissionId()).orElseThrow(() -> new CodeSubmissionNotFoundException("Code Submission not found with : " + commentRequest.getSubmissionId()));

        Comment comment = new Comment();
        comment.setCommentedOn(codeSubmission);
        comment.setContent(commentRequest.getContent());
        comment.setCreatedBy(user);
        comment.setDate(LocalDateTime.now());
        commentRepository.save(comment);

        CommentResponse commentResponse = new CommentResponse();
        commentResponse.setId(comment.getId());
        commentResponse.setContent(comment.getContent());
        commentResponse.setDate(comment.getDate());
        commentResponse.setLikes(comment.getLikes());
        commentResponse.setCreatedByUsername(user.getUsername());
        commentResponse.setSubmissionId(comment.getCommentedOn().getId());


        return commentResponse;
    }

    public CommentResponse updateComment(Long id, String content) {

        Comment comment = commentRepository.findById(id).orElseThrow(() -> new CommentNotFoundException("Comment not Found By Id : " + id));
        comment.setContent(content);
        comment.setDate(LocalDateTime.now());
        commentRepository.save(comment);

        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setDate(comment.getDate());
        response.setLikes(comment.getLikes());
        response.setCreatedByUsername(comment.getCreatedBy().getUsername());
        response.setSubmissionId(comment.getCommentedOn().getId());


        return response;
    }

    public void deleteComment(Long id) {

        commentRepository.deleteById(id);

    }

    public int getLikes(Long commentId) {

        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Comment not Found By Id : " + commentId));

        return comment.getLikes();

    }

    public int likeComment(Long commentId) {

        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Comment not Found By Id : " + commentId));

        comment.setLikes(comment.getLikes() + 1);
        commentRepository.save(comment);

        return comment.getLikes();
    }

    public List<CommentResponse> getCommentsBySubmission(Long submissionId) {

        List<Comment> comments = commentRepository.findByCommentedOnId(submissionId);
        List<CommentResponse> commentResponseList = new ArrayList<>();

        for (Comment comment : comments) {

            CommentResponse response = new CommentResponse();
            response.setId(comment.getId());
            response.setContent(comment.getContent());
            response.setDate(comment.getDate());
            response.setLikes(comment.getLikes());
            response.setCreatedByUsername(comment.getCreatedBy().getUsername());
            response.setSubmissionId(comment.getCommentedOn().getId());

            commentResponseList.add(response);

        }

        return commentResponseList;
    }

}
