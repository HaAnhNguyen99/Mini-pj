package vn.edu.likelion.model.course;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CourseReturnHomePageResponse {

    private Integer id;

    private String title;

    private String slug;

    private String thumbnail;

    @JsonProperty("new_price")
    private long newPrice;

    @JsonProperty("old_price")
    private long oldPrice;

    @JsonProperty("total_learners")
    private int totalLearners;

    @JsonProperty("category_name")
    private String categoryName;
}
