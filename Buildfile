# ===========================================================================
# Project:   MvoEdge
# Copyright: (c) 2009 RERO
# ===========================================================================

# Add initial buildfile information here
config :all, :url_prefix => '/' :required => [:sproutcore, :LOG]
proxy '/multivio', :to => 'doc.test.rero.ch' 
