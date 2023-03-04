class Pet {
  constructor(image, name, age) {
    this.image = image;
    this.name = name;
    this.age = age;
  }

  static fromJson(json) {
    const { image, name, age } = JSON.parse(json);
    return new Pet(image, name, age);
  }

  static toJson(post) {
    return JSON.stringify(post);
  }
}
