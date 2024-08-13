package vn.edu.likelion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.likelion.model.course.CourseReturnHomePageResponse;
import vn.edu.likelion.service.impl.CourseServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired private CourseServiceImpl courseService;

    @GetMapping("/home-page")
    public ResponseEntity<?> getAllReturnHomePage(){
        List<CourseReturnHomePageResponse> listCourses = courseService.listCourseReturnHomePage();
        if (listCourses.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(listCourses);
    }
}
