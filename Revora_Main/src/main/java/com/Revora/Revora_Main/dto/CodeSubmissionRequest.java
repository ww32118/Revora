package com.Revora.Revora_Main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodeSubmissionRequest {

    private Long userId;
    private String title;
    private String codeContent;
    private String description;
    private String programmingLanguage;

}
