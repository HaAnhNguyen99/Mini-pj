package vn.edu.likelion;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import vn.edu.likelion.entity.Category;
import vn.edu.likelion.entity.Course;
import vn.edu.likelion.repository.CourseRepository;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class CourseRepositoryTest {
    @Autowired private CourseRepository courseRepository;

    @Test
    public void testCreateCourse(){

        Course course1 = new Course("Java 17 Masterclass: Start Coding in 2024", "java-the-complete-java-developer-course",
                "Acquire Key Java Skills: From Basics to Advanced Programming and Certification - Start Your Dev Career",
                "https://res.cloudinary.com/dqnoopa0x/image/upload/v1723533376/konauxwk29zexktezzhs.webp",
                299000, 350000, new Category(1));

        Course course2 = new Course("Learn C++ Programming - Beginner to Advanced", "learn-cpp-programming-beginner-to-advanced",
                "Object Oriented Programming using C++ Language with File Handling, Exception Handling, Standard Template Library",
                "https://res.cloudinary.com/dqnoopa0x/image/upload/v1723533615/oyocdegotvmp01zuh7a0.jpg",
                345000, 550000, new Category(1));

        Course course3 = new Course("Ultimate C# Masterclass for 2024", "ultimate-csharp-masterclass",
                "In-depth .NET programming course from basics to advanced. Focus on clean code, performance and practice",
                "https://res.cloudinary.com/dqnoopa0x/image/upload/v1723533763/dxhhgampzijmdqksz9tk.png",
                590000, 659000, new Category(1));

        Course course4 = new Course("The Complete JavaScript Course 2024: From Zero to Expert", "the-complete-javascript-course",
                "The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory. Many courses in one!",
                "https://res.cloudinary.com/dqnoopa0x/image/upload/v1723533902/f2ua1awsatv1csdbq74p.png",
                267000, 324000, new Category(1));

        Course course5 = new Course("The Complete 2024 Web Development Bootcamp", "the-complete-web-development-bootcamp",
                "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps",
                "https://res.cloudinary.com/dqnoopa0x/image/upload/v1723534035/wgx3dvyteudahxztb2jm.jpg",
                756000, 987000, new Category(2));

        Course course6 = new Course("Complete Web & Mobile Designer: UI/UX, Figma, +more", "complete-web-designer-mobile-designer-zero-to-mastery",
                "Become a UX/UI Designer! Master Mobile and Web Design, User Interface + User Experience (UI/UX Design), HTML, and CSS",
                "https://res.cloudinary.com/dqnoopa0x/image/upload/v1723534207/xgdlwnmdbozwfjfbhiho.jpg",
                219000, 320000, new Category(2));

        Course course7 = new Course("RESTful Web Services, Java, Spring Boot, Spring MVC and JPA", "restful-web-service-with-spring-boot-jpa-and-mysql",
                "Implement API calls: Sign-up, sign-in, email verification, password reset, update, delete. Deploy to Amazon AWS Cloud.",
                "https://res.cloudinary.com/dqnoopa0x/image/upload/v1723534318/w6km8a8dxmphrkelzgl5.jpg",
                359000, 419000, new Category(2));

        Course course8 = new Course("iOS & Swift - The Complete iOS App Development Bootcamp", "ios-13-app-development-bootcamp",
                "From Beginner to iOS App Developer with Just One Course! Fully Updated with a Comprehensive Module Dedicated to SwiftUI!",
                "https://res.cloudinary.com/dqnoopa0x/image/upload/v1723534422/quiikd1jwwmt6nt7zbxt.jpg",
                576000, 690000, new Category(3));

        Course course9 = new Course("The Complete Android 14 & Kotlin Development Masterclass", "android-kotlin-developer",
                "Learn Android 14 App Development From Begin",
                "https://res.cloudinary.com/dqnoopa0x/image/upload/v1723534535/zmklgboqd5edhz4g1oum.jpg",
                399000, 450000, new Category(3));

        Course course10 = new Course("Flutter & Dart - The Complete Guide [2024 Edition]", "learn-flutter-dart-to-build-ios-android-apps",
                "A Complete Guide to the Flutter SDK &amp; Flutter Framework for building native iOS and Android apps",
                "https://res.cloudinary.com/dqnoopa0x/image/upload/v1723534664/vyeiw2aasrarjs9lrqfl.png",
                439000, 500000, new Category(3));

        List<Course> listCourses = courseRepository.saveAll(List.of(course1, course2, course3, course4, course5, course6,
                course7, course8, course9, course10));
        Assertions.assertThat(listCourses).hasSize(10);
    }
}
