package ru.kata.spring.boot_security.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.models.User;
import ru.kata.spring.boot_security.services.RoleService;
import ru.kata.spring.boot_security.services.UserService;


@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, PasswordEncoder passwordEncoder, RoleService roleService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }

    @GetMapping()
    public String getAll(ModelMap model) {

        model.addAttribute("users", userService.findAll());
        return "admin";
    }

    @GetMapping(value = "/new")
    public String getNewUserForm(@ModelAttribute("user") User user, Model model) {

        model.addAttribute("allRoles", roleService.findAll());
        model.addAttribute("msg", "Создать нового пользователя");
        return "new";
    }

    @PostMapping()
    public String saveUser(@ModelAttribute("user") User user, Model model) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (!userService.saveUser(user)) {
            model.addAttribute("usernameError", "Пользователь с таким именем уже существует");
            return "admin/new";
        }
        return "redirect:/admin";
    }

    @GetMapping("/edit")
    public String getEditUserForm(@RequestParam(value = "id") long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        model.addAttribute("allRoles", roleService.findAll());
        model.addAttribute("msg", "Изменить существующего пользователя");
        return "edit";
    }

    @PutMapping()
    public String updateUser(@ModelAttribute("user") User user
            , Model model) {

        System.out.println(user.getRoles());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (!userService.updateUser(user)) {
            model.addAttribute("updateUserError", "Не удалось обновить пользователя");
        }
        return "redirect:/admin";
    }

    @DeleteMapping()
    public String delete(@RequestParam(value = "id") long id, Model model) {

        if (!userService.deleteById(id)) {
            model.addAttribute("deleteUserError", "Не удалось удалить пользователя");
        }
        return "redirect:/admin";
    }


}