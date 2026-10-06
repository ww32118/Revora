package com.Revora.Revora_Main.dto;
import com.Revora.Revora_Main.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String username;
    private List<Role> role = new ArrayList<>();
    private LocalDateTime createdAt;

}
