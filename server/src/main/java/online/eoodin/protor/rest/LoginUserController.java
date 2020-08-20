package online.eoodin.protor.rest;

import online.eoodin.protor.security.MyUserPrincipal;
import online.eoodin.protor.model.AccessorInfo;
import online.eoodin.protor.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class LoginUserController {

    @RequestMapping("/accessor")
    public AccessorInfo getAccessorInfo() {
        AccessorInfo profile = new AccessorInfo();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserPrincipal userPrincipal = (MyUserPrincipal) auth.getPrincipal();
        User user = translateUser(userPrincipal.getUser());
        profile.setUser(user);

        return profile;
    }

    private User translateUser(online.eoodin.protor.entity.User entity) {
        User user = new User();
        user.setUsername(entity.getUsername());
        user.setDisplayName(entity.getName());
        user.setEmail(entity.getEmail());
        return user;
    }
}
