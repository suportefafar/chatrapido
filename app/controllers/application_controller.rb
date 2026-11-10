class ApplicationController < ActionController::Base
  # Temporarily lowered Chrome minimum from 120 to 109 on 2026-11-10.
  # Other modern-browser minimums remain unchanged.
  allow_browser versions: { chrome: 109, safari: 17.2, firefox: 121, opera: 106, ie: false }

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes
end
