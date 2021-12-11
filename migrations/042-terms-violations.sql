-- Up

UPDATE users SET bannedTerms = replace(bannedTerms, 'propagation of totalitarian regimes', 'totalitarian') WHERE bannedTerms IS NOT NULL;
UPDATE users SET bannedTerms = replace(bannedTerms, 'hate speech', 'hateSpeech') WHERE bannedTerms IS NOT NULL;
UPDATE users SET bannedTerms = replace(bannedTerms, 'queer exclusionism', 'exclusionism') WHERE bannedTerms IS NOT NULL;
UPDATE users SET bannedTerms = replace(bannedTerms, 'child pornography', 'childPornography') WHERE bannedTerms IS NOT NULL;
UPDATE users SET bannedTerms = replace(bannedTerms, 'unlawful conduct', 'unlawfulConduct') WHERE bannedTerms IS NOT NULL;
UPDATE users SET bannedTerms = replace(bannedTerms, 'sharing of someone else''s personal data', 'doxxing') WHERE bannedTerms IS NOT NULL;
UPDATE users SET bannedTerms = replace(bannedTerms, 'copyright or trademark violations', 'copyright') WHERE bannedTerms IS NOT NULL;

-- Down

