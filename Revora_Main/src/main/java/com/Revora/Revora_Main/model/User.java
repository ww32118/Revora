package com.Revora.Revora_Main.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "rev_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String username;

    private String email;
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Role> role = new ArrayList<>();

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "createdBy")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "reviewedBy")
    private List<Review> reviews =  new ArrayList<>();

    @ManyToMany(mappedBy = "users")
    private List<CodeSubmission> submissions = new ArrayList<>();

    @OneToMany(mappedBy = "submittedBy")
    private List<CodeSubmission> codeSubmitted = new ArrayList<>();
}
