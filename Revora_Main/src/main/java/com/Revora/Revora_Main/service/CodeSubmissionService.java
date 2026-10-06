package com.Revora.Revora_Main.service;

import com.Revora.Revora_Main.dto.CodeSubmissionRequest;
import com.Revora.Revora_Main.dto.CodeSubmissionResponse;
import com.Revora.Revora_Main.dto.UpdateCodeRequest;
import com.Revora.Revora_Main.exception.CodeSubmissionNotFoundException;
import com.Revora.Revora_Main.exception.UnauthorizedActionException;
import com.Revora.Revora_Main.exception.UserNotFoundException;
import com.Revora.Revora_Main.model.CodeSubmission;
import com.Revora.Revora_Main.model.SubmissionStatus;
import com.Revora.Revora_Main.model.User;
import com.Revora.Revora_Main.repository.CodeSubmissionRepository;
import com.Revora.Revora_Main.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CodeSubmissionService {

    private final CodeSubmissionRepository codeSubmissionRepository;
    private final UserRepository userRepository;

    public CodeSubmissionService(CodeSubmissionRepository codeSubmissionRepository, UserRepository userRepository) {
        this.codeSubmissionRepository = codeSubmissionRepository;
        this.userRepository = userRepository;
    }

    public CodeSubmissionResponse addCode(CodeSubmissionRequest codeSubmissionRequest) {

        User user = userRepository.findById(codeSubmissionRequest.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found by Id : " + codeSubmissionRequest.getUserId()));

        CodeSubmission codeSubmission = new CodeSubmission();
        codeSubmission.setTitle(codeSubmissionRequest.getTitle());
        codeSubmission.setCodeContent(codeSubmissionRequest.getCodeContent());
        codeSubmission.setDescription(codeSubmissionRequest.getDescription());
        codeSubmission.setProgrammingLanguage(codeSubmissionRequest.getProgrammingLanguage());
        codeSubmission.setSubmittedBy(user);
        codeSubmission.setStatus(SubmissionStatus.OPEN);
        codeSubmission.setSubmittedOn(LocalDateTime.now());
        codeSubmissionRepository.save(codeSubmission);

        CodeSubmissionResponse response = new CodeSubmissionResponse();
        response.setId(codeSubmission.getId());
        response.setTitle(codeSubmission.getTitle());
        response.setDescription(codeSubmission.getDescription());
        response.setProgrammingLanguage(codeSubmission.getProgrammingLanguage());
        response.setSubmittedOn(codeSubmission.getSubmittedOn());
        response.setCodeContent(codeSubmission.getCodeContent());
        response.setStatus(codeSubmission.getStatus());
        response.setSubmittedByUsername(codeSubmission.getSubmittedBy().getUsername());

        return response;
    }

    public CodeSubmissionResponse updateCode(UpdateCodeRequest updateCodeRequest) {

        CodeSubmission submission = codeSubmissionRepository.findById(updateCodeRequest.getSubmissionId())
                .orElseThrow(() -> new CodeSubmissionNotFoundException("Code Submission Not Found By Id : " + updateCodeRequest.getSubmissionId()));

        assertOwnerOrAdmin(submission);

        submission.setTitle(updateCodeRequest.getTitle());
        submission.setDescription(updateCodeRequest.getDescription());
        submission.setProgrammingLanguage(updateCodeRequest.getProgrammingLanguage());
        submission.setStatus(updateCodeRequest.getStatus());
        codeSubmissionRepository.save(submission);

        CodeSubmissionResponse response = new CodeSubmissionResponse();
        response.setId(submission.getId());
        response.setTitle(submission.getTitle());
        response.setDescription(submission.getDescription());
        response.setProgrammingLanguage(submission.getProgrammingLanguage());
        response.setSubmittedOn(submission.getSubmittedOn());
        response.setCodeContent(submission.getCodeContent());
        response.setStatus(submission.getStatus());
        response.setSubmittedByUsername(submission.getSubmittedBy().getUsername());

        return response;
    }

    public void deleteCode(Long submissionId) {

        CodeSubmission submission = codeSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new CodeSubmissionNotFoundException("Code Submission Not Found By Id : " + submissionId));

        assertOwnerOrAdmin(submission);

        codeSubmissionRepository.deleteById(submissionId);
    }

    public List<CodeSubmissionResponse> getAllSubmissions() {

        List<CodeSubmission> submissions = codeSubmissionRepository.findAll();
        List<CodeSubmissionResponse> codeSubmissionResponsesList = new ArrayList<>();

        for (CodeSubmission codeSubmission : submissions) {

            CodeSubmissionResponse response = new CodeSubmissionResponse();

            response.setId(codeSubmission.getId());
            response.setTitle(codeSubmission.getTitle());
            response.setDescription(codeSubmission.getDescription());
            response.setCodeContent(codeSubmission.getCodeContent());
            response.setProgrammingLanguage(codeSubmission.getProgrammingLanguage());
            response.setSubmittedOn(codeSubmission.getSubmittedOn());
            response.setSubmittedByUsername(codeSubmission.getSubmittedBy().getUsername());
            response.setStatus(codeSubmission.getStatus());
            codeSubmissionResponsesList.add(response);

        }

        return codeSubmissionResponsesList;
    }

    public CodeSubmissionResponse getSubmissionById(Long id) {

        CodeSubmission submission = codeSubmissionRepository.findById(id).orElseThrow(() -> new CodeSubmissionNotFoundException("Code Submission Not Found By Id : " + id));

        CodeSubmissionResponse response = new CodeSubmissionResponse();
        response.setId(submission.getId());
        response.setTitle(submission.getTitle());
        response.setDescription(submission.getDescription());
        response.setCodeContent(submission.getCodeContent());
        response.setProgrammingLanguage(submission.getProgrammingLanguage());
        response.setSubmittedOn(submission.getSubmittedOn());
        response.setSubmittedByUsername(submission.getSubmittedBy().getUsername());
        response.setStatus(submission.getStatus());

        return response;

    }

    // naya method, class ke andar kahi bhi add karo
    private void assertOwnerOrAdmin(CodeSubmission submission) {
        String currentUsername = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        boolean isOwner = submission.getSubmittedBy().getUsername().equals(currentUsername);

        boolean isAdmin = userRepository.findByUsername(currentUsername)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN")))
                .orElse(false);

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedActionException("You can only modify your own submissions.");
        }
    }

}