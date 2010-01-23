# ===========================================================================
# Project:   MvoEdge
# Copyright: (c) 2009 RERO
# ===========================================================================

# Add initial buildfile information here
config :all, :required => [:sproutcore, :LOG]
proxy '/', :to => 'demo.multivio.org', :url => '/'
