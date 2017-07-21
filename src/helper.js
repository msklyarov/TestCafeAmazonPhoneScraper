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

  static async fetchClick(isLessThen24Products) {
    const scrollTimeouts = [];
    scrollTimeouts[800] = 200;
    scrollTimeouts[1200] = 200;
    scrollTimeouts[1600] = 300;
    scrollTimeouts[2000] = 100;
    scrollTimeouts[2200] = 200;
    scrollTimeouts[2400] = 100;
    scrollTimeouts[2600] = 100;
    scrollTimeouts[3000] = 300;

    if (isLessThen24Products) {
      scrollTimeouts[3500] = 200;
    }

    for (let yPos in scrollTimeouts) {
      await Helper.sleep(scrollTimeouts[yPos],
        async () => await Helper.scrollTo(yPos)
      );
    }

    await Helper.sleep(300,
      async () => {
        if (!isLessThen24Products) {
          await Helper.clickNextPage();
        }
      }
    );
  }

  static fetchAsin = ClientFunction(
    (i) => document.getElementById('s-results-list-atf')
      .children[i].getAttribute("data-asin")
  );

  static fetchTitleAndBrandName = ClientFunction((i) => {
    let title, brand;
    const el = document.getElementById('s-results-list-atf')
      .children[i].getElementsByClassName("s-access-title");

    if (!!el[0]) {
      title = el[0].innerText;
      title = title.replace(/,/g, "");

      if (el[0].parentNode.parentNode.nextElementSibling) {
        brand = el[0].parentNode.parentNode.nextElementSibling.children[1].innerText;
        brand = brand.replace(/,/g, '');
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
    let priceText = 0;
    const el = document.getElementById('s-results-list-atf')
      .children[i].getElementsByClassName("s-price");

    //Check if the s-price class is used
    if (!!el[0]) {
      priceText = el[0].innerText;
      priceText = priceText.replace(/,/g, '');
      priceText = parseFloat(priceText);
    } else {
      //Check if price is mentioned other way
      const otherEl =
        document.getElementById('s-results-list-atf')
          .children[i].getElementsByClassName("a-color-price");

      if (!!otherEl[0]) {
        priceText = otherEl[0].innerText;
        priceText = priceText.replace(/,/g, '');
        priceText = parseFloat(priceText);
      }
    }

    return priceText;
  });

  static fetchRatingAndNumberOfReviews = ClientFunction((i) => {
    let ratingText = "N/A";
    let rating = 0;
    let numberOfReviews = 0;
    let reviewsLink = "N/A";

    const el = document.getElementById('s-results-list-atf')
      .children[i].getElementsByClassName("a-icon-star");

    if (!!el[0])
    {
      ratingText = el[0].innerText;
      ratingText = ratingText.replace(/,/g, '');
      rating = parseFloat(ratingText);

      if (!!el[0].parentNode.parentNode.parentNode.nextElementSibling) {
        numberOfReviews = el[0].parentNode.parentNode.parentNode.nextElementSibling.innerText;
        numberOfReviews = numberOfReviews.replace(/,/g, '');

        reviewsLink = el[0].parentNode.parentNode.parentNode.nextElementSibling.getAttribute('href');
      }
    }

    return [ratingText, rating, numberOfReviews, reviewsLink];
  });

  static fetchImage = ClientFunction((i) => {
    let imageLink = "N/A";

    const el = document.getElementById('s-results-list-atf')
      .children[i].getElementsByTagName("img");
    if (!!el[0]) {
      imageLink = el[0].getAttribute('src');
    }

    return imageLink;
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
    const pagesCountText = document.getElementsByClassName("pagnDisabled");
    return parseInt(pagesCountText[0].innerText);
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
