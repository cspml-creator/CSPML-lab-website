# People / Profile Photos

Place faculty and student profile photos here.

## Recommended Specifications
- **Size:** 400 × 400 pixels (square crop — important!)
- **Format:** JPG or PNG
- **File naming:** Use the person's initials or short name in lowercase
  - Example: `prof-mks.jpg`, `student-ravi-s.jpg`, `student-ananya-p.jpg`

## How to Use
After placing your photo here, open `index.html`.  
Find the person's card — it will look like this:

```html
<!-- EDIT: PERSON photo → replace src below -->
<img class="person-photo" src="images/placeholder/person.svg"
     data-name="prof-mks" alt="Prof. Mrutyunjay K. S.">
```

Change the `src` to your photo:

```html
<img class="person-photo" src="images/people/prof-mks.jpg"
     data-name="prof-mks" alt="Prof. Mrutyunjay K. S.">
```

## Tips
- Crop photos to a square before saving (use Paint, Photos app, or any image editor)
- Good lighting and a plain background look best on the website
- File size should ideally be under 200 KB for fast loading
