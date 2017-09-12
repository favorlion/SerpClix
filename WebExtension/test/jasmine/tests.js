jasmine.getFixtures().fixturesPath = 'base/WebExtension/test/fixtures';


describe("The management of an in-progress order fulfilling", function() {
  var orderPheromones = {url: "http://houseofpheromones.com/pheromones-for-men-best"};
  var orderGrandHome = {url: "www.grandhomedesign.com/interior-home-improvement/corner-shower/"};
  var orderTherapist = {url: "https://www.youtube.com/watch?v=ZwJs8xkv03Q"};
  var orderSwatWildlife = {url: "http://www.swatwildlife.com"};
  
  it("should find the order url in the fixture HTML", function() {
    loadFixtures("pheromones-valid.html");
    expect(findOrderLink(orderPheromones)).toBe(true);
  });
  
  it("should find the order url in the fixture HTML even when there's no protocol", function() {
    loadFixtures("grand-home-design.html");
    expect(findOrderLink(orderGrandHome)).toBe(true);
  });

  it("should find the order url in the fixture HTML when there's a query string", function() {
    loadFixtures("therapist-yt.html");
    expect(findOrderLink(orderTherapist)).toBe(true);
  });
  
  it("should not find the order url in the fixture HTML", function() {
    loadFixtures("pheromones-invalid.html");
    expect(findOrderLink(orderPheromones)).toBe(false);
  });

});
