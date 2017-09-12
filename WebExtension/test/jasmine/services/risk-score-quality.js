describe("riskScoreQuality", function() {
  var riskScoreQuality;
  
  beforeEach(module("serpClix"));
  beforeEach(inject(function(_riskScoreQuality_) {
	riskScoreQuality = _riskScoreQuality_;
  }));
  
  it("should translate the risk score to appropriate quality indicator", function() {
	expect(riskScoreQuality(70)).toEqual("Very bad"); 
  });
  
})
