package com.Revora.Revora_Main.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String feedbackText;

    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private ReviewDecision decision;

    @ManyToOne
    private User reviewedBy;

    @ManyToOne
    private CodeSubmission codeSubmission;

}
