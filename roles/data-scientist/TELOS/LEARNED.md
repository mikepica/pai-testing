# Learned

## L1: Lab data is never as clean as IT says it is
Every dataset I've received has had undocumented batch effects, mislabeled controls, or protocol version inconsistencies. Now I budget 2-3 weeks for data quality assessment before any modeling work.

## L2: A family of small models beats one big model
My ChemBERTa work showed that modality-specific fine-tuning outperforms a general compound activity model by 12% on held-out data. Specialization wins.

## L3: Protocol PDF extraction is an unsolved problem
Our NLP pipeline works for lab notebooks (structured, consistent format). Clinical protocol PDFs vary wildly — different sponsors, different structures, different terminologies. I spent 6 weeks on this before accepting it needs a dedicated research effort.
