jasmine.getFixtures().fixturesPath = 'base/Firefox-Ext/test/fixtures';


describe("The management of an in-progress order fulfilling", function() {
  var orderPheromones = {url: "https://houseofpheromones.com/pheromones-for-men-best"};
  var orderGrandHome = {url: "www.grandhomedesign.com/interior-home-improvement/corner-shower/"};
  var orderSwatWildlife = {url: "http://www.swatwildlife.com"};
  
  it("should find the order url in the fixture HTML", function() {
    loadFixtures("pheromones-valid.html");
    expect(findOrderLink(orderPheromones)).toBe(true);
  });
  
  it("should find the order url in the fixture HTML even when there's no protocol", function() {
    loadFixtures("grand-home-design.html");
    expect(findOrderLink(orderGrandHome)).toBe(true);
  });
  
  it("should not find the order url in the fixture HTML", function() {
    loadFixtures("pheromones-invalid.html");
    expect(findOrderLink(orderPheromones)).toBe(false);
  });

  it("should detect the current open page as the order URL even if missing www in the url bar", function() {
    // assign to the window.location.href without necessarily navigating the browser [IMPOSSIBLE?!]
    window.location.href = "swatwildlife.com";
    expect(onOrderPage(orderSwatWildlife)).not.toBe(true);
  });

});
