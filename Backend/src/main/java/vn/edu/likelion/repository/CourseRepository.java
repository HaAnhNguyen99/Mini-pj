package vn.edu.likelion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.likelion.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

}
