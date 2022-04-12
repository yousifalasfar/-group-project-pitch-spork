package com.launchacademy.reviews.controllers;

import com.launchacademy.reviews.models.Album;
import com.launchacademy.reviews.models.Review;
import com.launchacademy.reviews.services.AlbumService;
import com.launchacademy.reviews.services.ReviewsService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ApiRestControllerV1 {

  private AlbumService albumService;
  private ReviewsService reviewsService;

  @Autowired
  public ApiRestControllerV1(AlbumService albumService,
      ReviewsService reviewsService) {
    this.albumService = albumService;
    this.reviewsService = reviewsService;
  }

  @GetMapping("/albums")
  public List<Album> getAllAlbums() {
    return albumService.findAllAlbums();
  }

  @GetMapping("/album/{id}")
  public Album getSpecificAlbum(@PathVariable Integer id) {
    return albumService.findById(id);
  }

  @GetMapping("/albums/random")
  public Album getRandomAlbum() {
    return albumService.getRandomAlbum();
  }

  @GetMapping("/reviews/{albumId}")
  public List<Review> getAllReviewsForAlbum(@PathVariable Integer albumId) {
    return reviewsService.findAllReviewsForAlbum(albumId);
  }

  @GetMapping("/albums/undiscovered")
  public List<Album> getUnreviewedAlbums() {
    return albumService.findUnreviewedAlbums();
  }

  @PostMapping("/albums/create")
  public ResponseEntity createAlbum(@RequestBody @Valid Album album, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      Map<String, String> errors = new HashMap<>();
      List<FieldError> fieldErrors = bindingResult.getFieldErrors();
      for (int i = 0; i < fieldErrors.size(); i++) {
        errors.put(fieldErrors.get(i).getField(), fieldErrors.get(i).getDefaultMessage());
      }
      return new ResponseEntity(errors, HttpStatus.UNPROCESSABLE_ENTITY);
    } else {
      return new ResponseEntity<Album>(albumService.saveAlbum(album), HttpStatus.OK);
    }
  }

  @PostMapping("/review/create/{albumId}")
  public ResponseEntity createReview(@RequestBody @Valid Review review, BindingResult bindingResult,
      @PathVariable Integer albumId) {
    if (bindingResult.hasErrors()) {
      Map<String, String> errors = new HashMap<>();
      List<FieldError> fieldErrors = bindingResult.getFieldErrors();
      for (int i = 0; i < fieldErrors.size(); i++) {
        errors.put(fieldErrors.get(i).getField(), fieldErrors.get(i).getDefaultMessage());
      }
      return new ResponseEntity(errors, HttpStatus.UNPROCESSABLE_ENTITY);
    } else {
      return new ResponseEntity<Review>(reviewsService.saveReview(review, albumId), HttpStatus.OK);
    }
  }

}
