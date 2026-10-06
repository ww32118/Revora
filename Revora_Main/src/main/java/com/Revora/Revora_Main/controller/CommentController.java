package com.Revora.Revora_Main.controller;

import com.Revora.Revora_Main.dto.CommentRequest;
import com.Revora.Revora_Main.dto.CommentResponse;
import com.Revora.Revora_Main.service.CommentService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {

        this.commentService = commentService;

    }

    @PostMapping("/add")
    public CommentResponse addComment(@RequestBody CommentRequest commentRequest) {

        return commentService.addComment(commentRequest);
    }

    @PutMapping("/update/{id}")
    public CommentResponse updateComment(@PathVariable Long id, @RequestParam String content) {

        return commentService.updateComment(id, content);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }

    @GetMapping("/{commentId}/likes")
    public int getLikes(@PathVariable Long commentId) {

        return commentService.getLikes(commentId);
    }

    @PutMapping("/{commentId}/like")
    public int likeComment(@PathVariable Long commentId) {

        return commentService.likeComment(commentId);
    }

    @GetMapping("/{submissionId}/comments")
    public List<CommentResponse> getCommentsBySubmission(@PathVariable Long submissionId) {

        return commentService.getCommentsBySubmission(submissionId);
    }
}
