package net.kenven.proto.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
public class Project {

    @RequestMapping(value = "/projects", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getProjects() {
        List<String> projects = new ArrayList<String>();
        projects.add("Project stub 1");
        return projects;
    }
}
