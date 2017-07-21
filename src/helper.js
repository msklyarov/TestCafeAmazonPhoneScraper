import { ClientFunction } from 'testcafe';

class Helper {
  static getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  static timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async sleep(delay, fn, ...args) {
    await Helper.timeout(delay);
    return fn(...args);
  }

  static fetchAsin = ClientFunction(
    (i) => document.getElementById('s-results-list-atf')
      .children[i].getAttribute("data-asin")
  );

  static fetchTitleAndBrandName = ClientFunction((i) => {
    let title, brand;
    const el = document.getElementById('s-results-list-atf')
      .children[i].getElementsByClassName("s-access-title");

    if (el[0] !== undefined) {
      title = el[0].innerText;
      title = title.replace(/,/g, "");

      if (el[0].parentNode.parentNode.nextElementSibling !== null) {
        brand = el[0].parentNode.parentNode.nextElementSibling.children[1].innerText;
        brand = brand.replace(/,/g, "");
      } else {
        brand = "N/A";
      }
    } else {
      title = "N/A";
      brand = "N/A";
    }

    return [title, brand];
  });

  static fetchPrice = ClientFunction((i) => {
    let price_text = 0;
    const el = document.getElementById('s-results-list-atf')
      .children[i].getElementsByClassName("s-price");

    //Check if the s-price class is used
    if (el[0] !== undefined) {
      price_text = el[0].innerText;
      price_text = price_text.replace(/,/g, "");
      price_text = parseFloat(price_text);
    } else {
      //Check if price is mentioned other way
      const otherEl =
        document.getElementById('s-results-list-atf')
          .children[i].getElementsByClassName("a-color-price");

      if (otherEl[0] !== undefined) {
        price_text = otherEl[0].innerText;
        price_text = price_text.replace(/,/g, "");
        price_text = parseFloat(price_text);
      }

      return price_text;
    }
  });

  static fetchRatingAndNumberOfReviews = ClientFunction((i) => {
    let rating_text = "N/A";
    let rating = 0;
    let number_of_reviews = 0;
    let reviews_link = "N/A";

    const el = document.getElementById('s-results-list-atf')
      .children[i].getElementsByClassName("a-icon-star");

    if (el[0] !== undefined)
    {
      rating_text = el[0].innerText;
      rating_text = rating_text.replace(/,/g,"");
      rating = parseFloat(rating_text);

      if (el[0].parentNode.parentNode.parentNode.nextElementSibling !== undefined)
      {

        number_of_reviews = el[0].parentNode.parentNode.parentNode.nextElementSibling.innerText;
        number_of_reviews = number_of_reviews.replace(/,/g, "");

        reviews_link = el[0].parentNode.parentNode.parentNode.nextElementSibling.getAttribute('href');
      }
    }

    return [rating_text, rating, number_of_reviews, reviews_link];
  });

  static fetchImage = ClientFunction((i) => {
    let image_link = "N/A";

    const el = document.getElementById('s-results-list-atf')
      .children[i].getElementsByTagName("img");
    if (el[0] !== undefined) {
      image_link = el[0].getAttribute('src');
    }

    return image_link;
  });

  static fetchPrime = ClientFunction(
    (i) => document.getElementById('s-results-list-atf')
      .children[i].getElementsByClassName("a-icon-prime").length > 0
  );

  static fetchCod = ClientFunction((i) => {
    const el = document.getElementById('s-results-list-atf')
      .children[i].getElementsByClassName("a-spacing-mini a-spacing-top-mini")[0];
    return !!el && (el.innerText.length > 0);
  });

  static getPagesCount = ClientFunction(() => {
    const pages_count_text = document.getElementsByClassName("pagnDisabled");
    return parseInt(pages_count_text[0].innerText);
  });

  static scrollTo = ClientFunction((yPos) => window.scrollTo(0, yPos));

  static clickNextPage = ClientFunction(
    () => document.getElementById("pagnNextLink").click()
  );

  static getResultsListContainerChildCount = ClientFunction(
    () => document.getElementById('s-results-list-atf').children.length
  );
}

export default Helper;
