package vn.edu.likelion;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import vn.edu.likelion.entity.Category;
import vn.edu.likelion.repository.CategoryRepository;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class CategoryRepositoryTest {
    @Autowired private CategoryRepository categoryRepository;

    @Test
    public void testCreateCategory(){
        Category category1 = new Category("Ngôn ngữ lập trình", "ngon-ngu-lap-trinh");
        Category category2 = new Category("Web Application", "web-app");
        Category category3 = new Category("Mobile Application", "mobile-app");

        List<Category> listCategories = categoryRepository.saveAll(List.of(category1, category2, category3));
        Assertions.assertThat(listCategories).hasSize(3);
    }
}
