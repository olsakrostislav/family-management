'use client';
import { useGetGroupsQuery } from '@/state/api';
import React from 'react';
import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { dataGridClassNames, dataGridSxStyles } from '@/helpers/utils';

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Group ID', width: 100 },
  { field: 'groupName', headerName: 'Group Name', width: 200 },
  { field: 'productOwnerUsername', headerName: 'Group Owner', width: 200 },
  {
    field: 'projectManagerUsername',
    headerName: 'Plan Manager',
    width: 200,
  },
];

const Groups = () => {
  const { data: groups, isLoading, isError } = useGetGroupsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !groups) return <div>Error fetching groups</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Groups" />
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={groups || []}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default Groups;
