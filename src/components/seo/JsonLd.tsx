import React from "react";

const BASE_URL = "https://ehpadcrecy.netlify.app";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ArticleItem {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  authorName?: string;
}

export function ArticleJsonLd({ article }: { article: ArticleItem }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url.startsWith("http") ? article.url : `${BASE_URL}${article.url}`,
    },
    image: article.image
      ? article.image.startsWith("http")
        ? article.image
        : `${BASE_URL}${article.image}`
      : `${BASE_URL}/images/global-hero.jpg`,
    author: {
      "@type": "Organization",
      name: article.authorName || "EHPAD de Crécy-la-Chapelle",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "EHPAD de Crécy-la-Chapelle",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/images/global-hero.jpg`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
