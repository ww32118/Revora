package com.Revora.Revora_Main.dto;

import com.Revora.Revora_Main.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateRoleRequest {

    private List<Role> role = new ArrayList<>();

}
