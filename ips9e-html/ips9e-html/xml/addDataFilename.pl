#!/usr/bin/perl


# Add data-href attributes on examples/questions/tables/figures
# This attribute can then be used by HTML parsers to easily identify
# the filename to store the example/question/table/figure


use utf8;
use strict;
binmode(STDIN, ":utf8");
binmode(STDOUT, ":utf8");

# my $baseXMLfile = "scc9e-ch01.xml"; #-------------------------> identify digfir XML file here
# my $baseXMLfile = "scc9e-ch02.xml"; #-------------------------> identify digfir XML file here
# my $baseXMLfile = "scc9e-ch03.xml"; #-------------------------> identify digfir XML file here
# my $baseXMLfile = "scc9e-ch04.xml"; #-------------------------> identify digfir XML file here
# my $baseXMLfile = "scc9e-ch05.xml"; #-------------------------> identify digfir XML file here
# my $baseXMLfile = "scc9e-ch06.xml"; #-------------------------> identify digfir XML file here
my $baseXMLfile = "scc9e-ch03.xml"; #-------------------------> identify digfir XML file here
my $datahrefXML_file = "${baseXMLfile}_datahref.xml";





# get digfir XML files content
my $xml_contents;
open my $FH, "<$baseXMLfile" or die;
while (<$FH>) {
  $xml_contents .= $_;
}	
close $FH;




#grab chapter number from the first number attribute which should be something like this: <chapter number="2" title="....>
my ($chapter) = $xml_contents =~ m/<chapter[^>]+number="(\d+)/i;
print "chapter: $chapter\n"; 






# examples
$xml_contents =~ s/(<box[^>]*block_type="EXP"[^>]*)(>\s*<p[^>]*>\s*<phrase[^>]*block_type="EXP-N-ri">EXAMPLE (\d+))/$1 data-filename="example_${chapter}_$3.html"$2/gs;

# tables (numbered)
$xml_contents =~ s/(<table[^>]*block_type="TABLE"[^>]*)(>.*?<phrase block_type="TBN-N-ri">TABLE (\d+)\.(\d+))/$1 data-filename="table_${chapter}_$4.html"$2/gs;


# figures (numbered)
$xml_contents =~ s/(<figure[^>]*block_type="FIGURE"[^>]*)(>.*?<phrase block_type="FG-N-ri">Figure (\d+)\.(\d+))/$1 data-filename="figure_${chapter}_$4.html"$2/gs;

# figures (unnumbered)
$xml_contents =~ s/(<figure[^>]*block_type="UN-FIGURE"[^>]*)(>.*?<image[^>]*src="[^"]*\/([^"]*)\.jpg")/$1 data-filename="${chapter}_$3.html"$2/gs;

# exercises (Now it's your turn)
$xml_contents =~ s/(<question[^>]*)(>\s*<p [^>]*>\s*<phrase block_type="BX2-QUE-N-ri">\s*(\d+)\.(\d+))/$1 block_type="exercise_${chapter}_$4.html"$2/gs;

# exercises (the rest)
$xml_contents =~ s/(<question[^>]*)(>\s*<p [^>]*>\s*<phrase block_type="CR-X-NL-N-ri">\s*(\d+)\.(\d+))/$1 block_type="exercise_${chapter}_$4.html"$2/gs;

# exercises (with icon in front)
$xml_contents =~ s/(<question[^>]*)(>\s*<p [^>]*>\s*<image [^>]*>\s*<phrase block_type="CR-X-NL-N-ri">\s*(\d+)\.(\d+))/$1 block_type="exercise_${chapter}_$4.html"$2/gs;




#save new XML with the data-hrefs to a new file 
 open my $fh1, ">$datahrefXML_file" or die;
 print $fh1 $xml_contents;	
 close $fh1;
 print STDERR "----> $datahrefXML_file written\n";


