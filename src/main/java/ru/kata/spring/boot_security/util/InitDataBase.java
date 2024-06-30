package ru.kata.spring.boot_security.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.models.Role;
import ru.kata.spring.boot_security.models.User;
import ru.kata.spring.boot_security.repositories.UserRepository;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class InitDataBase {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public InitDataBase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @PostConstruct
    private void postConstruct() {
        List<User> users = new ArrayList<>();

        Set<Role> roles = new HashSet<>();
        roles.add(new Role("ROLE_USER"));
        roles.add(new Role("ROLE_ADMIN"));

//        Set<Role> adminRoles = new HashSet<>();
//        adminRoles.add(new Role("ROLE_ADMIN"));


        users.add(new User("admin"
                , passwordEncoder.encode("admin")
                , "admin@admin.com"
                , roles));

        users.add(new User("user"
                , passwordEncoder.encode("user")
                , "user@user.com"
                , roles.stream().findFirst().stream().collect(Collectors.toSet())));

        users.add(new User("user1"
                , passwordEncoder.encode("user")
                , "user@user.com"
                , roles.stream().findFirst().stream().collect(Collectors.toSet())));

        users.add(new User("user2"
                , passwordEncoder.encode("user")
                , "user@user.com"
                , roles.stream().findFirst().stream().collect(Collectors.toSet())));

        System.out.println();
        userRepository.saveAll(users);

    }


}
