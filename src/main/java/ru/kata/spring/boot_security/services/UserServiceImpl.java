package ru.kata.spring.boot_security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.models.Role;
import ru.kata.spring.boot_security.models.User;
import ru.kata.spring.boot_security.repositories.RoleRepository;
import ru.kata.spring.boot_security.repositories.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }


    @Override
    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username));
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(new User());
    }

    @Override
    public boolean saveUser(User user) {

        Optional<User> userFromDB = userRepository.findById(user.getId());

        if (userFromDB.isPresent()) {
            return false;
        }
        User userToSave = new User();
        userToSave.setUsername(user.getUsername());
        userToSave.setEmail(user.getEmail());
        userToSave.setPassword(user.getPassword());
        userToSave.setRoles(user.getRoles());

        System.out.println(userToSave.toString() + "================================================");
        if (!userToSave.getRoles().isEmpty()) {
            System.out.println("РОЛИ НЕ ПУСТЫ У ЮЗЕРА ============================");
            userToSave.setRoles(user.getRoles().stream()
                    .map(role -> roleRepository.findById(role.getId()).orElseThrow())
                    .collect(Collectors.toSet()));
            userRepository.save(userToSave);
        } else {
            Set<Role> roles = Stream.of(roleRepository.findById(1L)
                    .get()).collect(Collectors.toSet());
            userToSave.setRoles(roles);
            System.out.println("============userToSave = " + userToSave);
            userRepository.save(userToSave);
        }

        return true;

    }

    @Override
    public boolean registerUser(User user) {

        Set<Role> roles = Stream.of(roleRepository.findById(1L)
                .get()).collect(Collectors.toSet());

        if (userRepository.findById(user.getId()).isPresent()) {
            return false;
        }
        user.setRoles(roles);
        userRepository.save(user);

        return true;

    }

    @Override
    public boolean updateUser(User user) {

        Optional<User> userFromDB = userRepository.findById(user.getId());
        if (userFromDB.isPresent()) {

            User updatedUser = userRepository.findById(user.getId()).orElse(new User());
            updatedUser.setUsername(user.getUsername());
            updatedUser.setPassword(user.getPassword());
            updatedUser.setEmail(user.getEmail());

            if (user.getRoles() == null) {
                Set<Role> roles = Stream.of(roleRepository.findById(1L)
                        .get()).collect(Collectors.toSet());
                updatedUser.setRoles(roles);
            } else {
                updatedUser.setRoles(user.getRoles());
            }

            userRepository.save(updatedUser);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteById(Long id) {

        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}