#!/usr/bin/perl


# Rreplace mathml in source digfir xml file with "place holders." 
# The mathml that was removed will be placed into temporary file,
# then mathml will be placed into JS file as a JS array

# Identify the digfir file to run this on below

# Output will be three files:
# 	no_math.xml = original file with mathml replaced with placeholders
# 	math_only = temporary file for holding the mathml
# 	mathjax_.js = the final JS array


use utf8;
use strict;
binmode(STDIN, ":utf8");
binmode(STDOUT, ":utf8");

my $baseXMLfile = "ips9e-ch01.xml"; #-------------------------> identify digfir file here
my $nomathXML_file = "math/${baseXMLfile}_no_math.xml";
my $mathXMLfile = "math/math_only_$baseXMLfile";
my $mathJSfile = "math/mathjax_$baseXMLfile.js";

my $contents;
my $temp_line;



###################################
# extract the math and put into temporary file
# as math is extracted, leave placeholders in original file


# get digfir XML files content
my $xml_contents;

 open my $FH, "<$baseXMLfile" or die;
 # $/ = undef;
 while (<$FH>) {
   $xml_contents .= $_;
 }	
 close $FH;

# take out the math
my $mathXML_contents;
my $placemarker = 1;

while ($xml_contents =~ s/(<m:math [^>]*display=["'](block|inline)['"][^>]*>.*?<\/m:math>)/<phrase data-math="math_$placemarker"><\/phrase>/s) {
	my $mathXML = $1;
	my $disp = $2;
	$mathXML =~ s`(</?m:math)`$1_$placemarker`g;
	$placemarker++;
	$mathXML_contents .= $mathXML . "\n";
}

#save new XML with the placeholders to a new file 
 open my $fh1, ">$nomathXML_file" or die;
 print $fh1 $xml_contents;	
 close $fh1;
 print STDERR "----> $nomathXML_file written\n";

#save math to temporary file
open my $fh2, ">$mathXMLfile" or die;
print $fh2 $mathXML_contents;	
close $fh2;





###################################
# create javascript hash and save to the new javascript file

my $mathJS_contents;

 open my $fh, "<$mathXMLfile" or die;
 # $/ = undef;
 while (<$fh>) {
   $contents .= $_;
 }	
 close $fh;


# print STDERR "\nMath2JS\n  $mathXMLfile read (math2js.pl)\n";

while ($contents =~ s/(<m:(math_\d+)[^>]*>(.*?)<\/m:math_\d+>)//s) {
	my $key = $2;
	my $value = $1;
	$value =~ s/(['|"])/\\$1/gs;
	#format mathml for mathjax
	$value =~ s/m:math_\d+/math/gs;
	$value =~ s/(<\/?)m:/$1/gs;
	$mathJS_contents .= "MathJaxMap['$key'] = '$value';\n";
}

open (JSFILE, ">$mathJSfile");
print JSFILE "var MathJaxMap = {};\n\n\n";
print JSFILE $mathJS_contents;	
print JSFILE "\n\n\n";
print JSFILE <<EOF;
for (var key in MathJaxMap) {
  
  if (MathJaxMap.hasOwnProperty(key)) {
    \$('[data-math=' + key + ']').html(MathJaxMap[key]);
  }
}

\$.ajaxSetup({
  cache: true
});

//configure the mathjax engine
window.MathJax = {
	"HTML-CSS": {
		mtextFontInherit: true,
		scale: 98,
		minScaleAdjust: 100,
		noReflows:false 
	},
	MathML: {
		useMathMLspacing: false
	},
	menuSettings: {
		zoom: "Click"	
	},
	MathMenu: {
		showFontMenu: true
	}
	
  };

\$.getScript( "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"); 
EOF
close (JSFILE);
