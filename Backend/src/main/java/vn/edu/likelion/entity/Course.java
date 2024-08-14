package vn.edu.likelion.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "courses")

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 60, nullable = false, unique = true)
    private String title;

    @Column(length = 70, nullable = false, unique = true)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 100, nullable = false)
    private String thumbnail;

    @Column(nullable = false, name = "new_price")
    private long newPrice;

    @Column(nullable = false, name = "old_price")
    private long oldPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    public Course(String title, String slug, String description, String thumbnail, long newPrice, long oldPrice, Category category) {
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.thumbnail = thumbnail;
        this.newPrice = newPrice;
        this.oldPrice = oldPrice;
        this.category = category;
    }
}
