import { SpecificationProp } from '@/app/types';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

interface Props {
  spec: SpecificationProp[];
  styling: string;
  stylingTitle: string;
  locale: string
}

export default function SpecificationTable({ spec, styling, stylingTitle, locale }: Props) {
  let counter = 1
  let allNotesNonNull: string[] = []
  let allAdditionalNotes: string[] = []
  // Step 1: Group data by parent
  const groupedByParent = spec.reduce((acc, curr) => {
    if (!acc[curr.parentname]) acc[curr.parentname] = [];
    acc[curr.parentname].push(curr);
    return acc;
  }, {} as Record<string, SpecificationProp[]>);


  return (
    <div className='pt-8'>
      {Object.entries(groupedByParent).map(([parentName, subGroups]) => {
        // Step 2: Collect all unique childnames
        const allChildren = Array.from(
          new Set(subGroups.flatMap((sub) => sub.child.map((c) => (locale === 'en' ? c.childnameEnglish : c.childnameIndo))))
        );

        //For all notes
        const allNotes = Array.from(
          (subGroups[0].child.map((c) => c.notes))
        );

        allNotesNonNull = [...allNotesNonNull, ...allNotes.filter((val) => val.trim() !== '')];

        // Step 3: Collect all subparent names (for column headers)
        const subParentNames = subGroups.map((s) =>
          s.subparentname && s.subparentname.trim() !== '' ? s.subparentname : ''
        );
        (parentName === "Additional Notes" || parentName === "Tambahan Catatan") &&
          subGroups.map((sub) => 
            sub.child.map((subsub) => 
              allAdditionalNotes.push(subsub.value)
          ))
          
        return (
          (parentName !== "Additional Notes" && parentName !== "Tambahan Catatan") &&
          <div key={parentName} className="mb-8">
            {/* <div className={`${stylingTitle}`}></div> */}
            <Table className='py-4'>
              <TableBody>
                {/* Header Row */}
                <TableRow className='hover:bg-transparent'>
                  <TableCell className={`${stylingTitle} pb-2 px-0 pt-0 text-start`}>{parentName}</TableCell>
                  {subParentNames.map((subName, idx) => (
                    <TableCell key={idx} className={`${styling} font-semibold text-xs text-end`}>
                      {subName}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Data Rows */}
                {allChildren.map((childName, rowIdx) => (
                  <TableRow key={rowIdx}>
                    <TableCell className={`${styling} p-2 border`}>
                      {childName}
                      {allNotes[rowIdx] && allNotes[rowIdx] !== '' && (
                        <sup className="text-xs ml-1">({counter++})</sup>
                      )}
                    </TableCell>
                    {subGroups.map((sub, subIdx) => {
                      const foundChild = sub.child.find((c) => (locale === 'en' ? c.childnameEnglish : c.childnameIndo) === childName);
                      const value =
                        foundChild && foundChild.value && foundChild.value.trim() !== ''
                          ? `${foundChild.value} ${foundChild.unit || ''}`
                          : '-';
                      return (
                        <TableCell
                          key={subIdx}
                          className={`${styling} text-left p-2 border`}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      })}
      <div className=''>
        {allNotesNonNull.map((val, idx) => 
          <div key={idx} className='text-xs'>
            ({idx + 1}) {val}
          </div>
        )}
        {allAdditionalNotes.map((val, idx) => 
          <div key={idx} className='text-xs'>
            - {val}
          </div>
        )}
      </div>
    </div>
  );
}