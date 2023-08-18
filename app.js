require("dotenv").config();
const logger = require("morgan");
const path = require("path");
const express = require("express");
const errorHandler = require("errorhandler");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
const port = process.env.PORT || 3000;

// const PrismicH = require("@prismicio/helpers");

// const Prismic = require("@prismicio/client");
const Prismic = require("prismic-javascript");

const PrismicDOM = require("prismic-dom");

const { application } = require("express");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler());
app.use(methodOverride());

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });
};

// Link Resolver
const HandleLinkResolver = (doc) => {
  if (doc.type === "product") {
    return `/detail/${doc.slug}`;
  }

  if (doc.type === "collections") {
    return "/collections";
  }

  if (doc.type === "about") {
    return `/about`;
  }
};

// Middleware to inject prismic context
app.use((req, res, next) => {
  //   res.locals.ctx = {
  //     endpoint: process.env.PRISMIC_ENDPOINT,
  //     linkResolver: HandleLinkResolver,
  //   };

  res.locals.Link = HandleLinkResolver;
  res.locals.PrismicDOM = PrismicDOM;
  res.locals.Numbers = (index) => {
    // eslint-disable-next-line eqeqeq
    return index == 0
      ? "One"
      : // eslint-disable-next-line eqeqeq
      index == 1
      ? "Two"
      : // eslint-disable-next-line eqeqeq
      index == 2
      ? "Three"
      : // eslint-disable-next-line eqeqeq
      index == 3
      ? "Four"
      : "";
  };

  next();
});
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
const handleRequest = async (api) => {
  const meta = await api.getSingle("meta");
  const preloader = await api.getSingle("preloader");
  const navigation = await api.getSingle("navigation");

  return {
    meta,
    navigation,
    preloader,
  };
};

app.get("/", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const home = await api.getSingle("home");

  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    { fetchLinks: "product.image" }
  );

  // console.log(home.data.button);

  res.render("pages/home", {
    ...defaults,
    home,
    collections,
  });
});

app.get("/about", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const about = await api.getSingle("about");

  res.render("pages/about", {
    ...defaults,
    about,
  });
});

app.get("/detail/:uid", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const meta = await api.getSingle("meta");
  const product = await api.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title",
  });

  if (product) {
    res.render("pages/detail", {
      ...defaults,
      product,
    });
  } else {
    res.status(404).render("./error_handlers/404");
  }
});

app.get("/collections", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const home = await api.getSingle("home");
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    { fetchLinks: "product.image" }
  );

  // console.log(home.data.collection);

  res.render("pages/collections", {
    ...defaults,
    collections,
    home,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// // "start": "concurrently --kill-others \"npm run backend:development\" \"npm run frontend:development\""
