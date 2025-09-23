#!/usr/bin/env node

/**
 * Frontend Blog Search Test
 * Tests if the frontend can connect to backend and search for blog posts
 */

const API_BASE_URL = "https://backend-6omk.onrender.com";

async function testBlogSearch() {
  console.log("🔍 Testing Blog Search from Frontend Perspective");
  console.log("Backend URL:", API_BASE_URL);
  console.log("=".repeat(60));

  try {
    // Test 1: Health check
    console.log("\n1. Testing Backend Health...");
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Backend is healthy");
      console.log(`   Status: ${healthData.status}`);
      console.log(`   Timestamp: ${healthData.timestamp}`);
    } else {
      console.log("❌ Backend health check failed");
      console.log(`   Status: ${healthResponse.status}`);
      return;
    }

    // Test 2: Search for blog posts
    console.log("\n2. Testing Blog Post Search...");
    const searchQueries = ["blog", "post", "article", "content"];

    for (const query of searchQueries) {
      console.log(`\nSearching for: "${query}"`);

      try {
        const searchResponse = await fetch(`${API_BASE_URL}/api/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
            filters: {
              contentTypes: ["blog_post"],
              locales: [],
              dateRange: "all",
            },
            limit: 10,
            threshold: 0.3,
          }),
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          console.log(
            `✅ Search successful - Found ${searchData.results.length} results`
          );

          if (searchData.results.length > 0) {
            console.log("   Sample results:");
            searchData.results.slice(0, 3).forEach((result, index) => {
              console.log(`   ${index + 1}. ${result.title}`);
              console.log(
                `      Type: ${result.contentType}, Similarity: ${result.similarity}`
              );
            });
          } else {
            console.log("   No results found for this query");
          }
        } else {
          const errorData = await searchResponse.json();
          console.log(`❌ Search failed: ${searchResponse.status}`);
          console.log(`   Error: ${errorData.error}`);
        }
      } catch (error) {
        console.log(`❌ Search request failed: ${error.message}`);
      }
    }

    // Test 3: General search (no content type filter)
    console.log("\n3. Testing General Search (All Content Types)...");
    try {
      const generalSearchResponse = await fetch(`${API_BASE_URL}/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: "blog",
          filters: {},
          limit: 10,
          threshold: 0.3,
        }),
      });

      if (generalSearchResponse.ok) {
        const generalSearchData = await generalSearchResponse.json();
        console.log(
          `✅ General search successful - Found ${generalSearchData.results.length} results`
        );

        if (generalSearchData.results.length > 0) {
          console.log("   Results by content type:");
          const resultsByType = {};
          generalSearchData.results.forEach((result) => {
            resultsByType[result.contentType] =
              (resultsByType[result.contentType] || 0) + 1;
          });

          Object.entries(resultsByType).forEach(([type, count]) => {
            console.log(`   - ${type}: ${count} results`);
          });
        }
      } else {
        console.log("❌ General search failed");
      }
    } catch (error) {
      console.log(`❌ General search request failed: ${error.message}`);
    }

    // Test 4: Check available filters
    console.log("\n4. Checking Available Content Types...");
    try {
      const filtersResponse = await fetch(`${API_BASE_URL}/api/filters`);

      if (filtersResponse.ok) {
        const filtersData = await filtersResponse.json();
        console.log("✅ Filters retrieved successfully");

        if (filtersData.filters && filtersData.filters.contentTypes) {
          console.log("   Available content types:");
          filtersData.filters.contentTypes.forEach((type) => {
            console.log(`   - ${type.value}: ${type.label}`);
          });
        }
      } else {
        console.log("❌ Failed to get filters");
      }
    } catch (error) {
      console.log(`❌ Filters request failed: ${error.message}`);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }

  console.log("\n" + "=".repeat(60));
  console.log("BLOG SEARCH TEST COMPLETE");
  console.log("=".repeat(60));
}

testBlogSearch().catch(console.error);
