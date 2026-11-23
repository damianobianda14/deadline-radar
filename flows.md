Verify Deadline Radar as ONE continuous flow. Stay on http://127.0.0.1:8377. Use test data only, no external links. Every numbered requirement below is an acceptance criterion. Do not declare success just because a click ran. Assert the observed result for each requirement.

1. Start with an empty tracker. If needed delete existing test items. Assert that the toolbar reads "0 tracked" and the empty-state message is visible.
2. Fill Contest name with "Kane Persistence Check", deadline with December 31, 2026 at 12:00 in the local browser timezone, leave optional URL blank, and click Add. Assert exactly one row with that exact name, a countdown other than EXPIRED, and toolbar text "1 tracked".
3. Reload the page. Assert that the row "Kane Persistence Check" is STILL visible, with the same deadline December 31, 2026 at 12:00, non-expired countdown, and toolbar text "1 tracked". Reloading alone does not satisfy this criterion.
4. Submit the form with an empty name. Assert a required-name validation error appears and the existing row is unchanged, exactly one tracked item.
5. Delete "Kane Persistence Check". Assert that its name is ABSENT from the list, toolbar is "0 tracked", and the empty-state message is visible. Clicking Delete alone does not satisfy this criterion.
6. Add "Kane Expired Check" with deadline January 1, 2020 at 12:00. Assert the row is present, its countdown is exactly EXPIRED and has red text, and toolbar is "1 tracked".
7. Click Clear expired. Assert "Kane Expired Check" is ABSENT, toolbar is "0 tracked", and the empty-state message is visible. Clicking Clear expired alone does not satisfy this criterion.
8. Reload again. Assert the tracker is still empty with "0 tracked" and neither test item present.

Final verdict must account for all eight criteria, explicitly failing any unverified criterion.
