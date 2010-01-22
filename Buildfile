# ===========================================================================
# Project:   MvoEdge
# Copyright: (c) 2009 RERO
# ===========================================================================

# Add initial buildfile information here
config :all, :required => [:sproutcore, :LOG]
proxy '/multivio', :to => 'demo.multivio.org' 
