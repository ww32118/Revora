package com.Revora.Revora_Main.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "code_submission")
public class CodeSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

    @Lob
    @Column(columnDefinition = "TEXT")
     private String codeContent;

     private String title;
     private String description;
     private LocalDateTime submittedOn;
     private String programmingLanguage;

     @Enumerated(EnumType.STRING)
     private SubmissionStatus status;

     @OneToMany(mappedBy = "commentedOn")
     private List<Comment> comments;

     @OneToMany(mappedBy = "codeSubmission")
     private List<Review> reviews;

    @ManyToOne
    private User submittedBy;

     @ManyToMany
     @JoinTable(
             name = "submisson_reviewers",
             joinColumns = @JoinColumn(name = "submission_id"),
             inverseJoinColumns = @JoinColumn(name = "user_id")
     )
     private  List<User> users;
}
