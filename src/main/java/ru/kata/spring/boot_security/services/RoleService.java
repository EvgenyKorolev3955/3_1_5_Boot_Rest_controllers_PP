package ru.kata.spring.boot_security.services;

import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.models.Role;

import java.util.Set;

public interface RoleService {


    @Transactional(readOnly = true)
    Set<Role> findAll();

}