select o.uid as ou, partner.uid as partner, max(case when agency.name <> 'DOD' then 1 else 0 end) as nondod
from dataelementcategoryoption co
join categoryoption_organisationunits corg on corg.categoryoptionid = co.categoryoptionid
join organisationunit o on o.organisationunitid = corg.organisationunitid
join categoryoptiongroupmembers ma on ma.categoryoptionid = co.categoryoptionid
join categoryoptiongroupmembers mp on mp.categoryoptionid = co.categoryoptionid
join categoryoptiongroup agency on agency.categoryoptiongroupid = ma.categoryoptiongroupid
join categoryoptiongroup partner on partner.categoryoptiongroupid = mp.categoryoptiongroupid
join categoryoptiongroupsetmembers ga on ga.categoryoptiongroupid = agency.categoryoptiongroupid
join categoryoptiongroupsetmembers gp on gp.categoryoptiongroupid = partner.categoryoptiongroupid
join categoryoptiongroupset sa on sa.categoryoptiongroupsetid = ga.categoryoptiongroupsetid and sa.name = 'Funding Agency'
join categoryoptiongroupset sp on sp.categoryoptiongroupsetid = gp.categoryoptiongroupsetid and sp.name = 'Implementing Partner'
group by o.uid, partner.uid
having max(case when agency.name = 'DOD' then 1 else 0 end) > 0
